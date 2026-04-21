using backend.Database;
using backend.Extensions;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy

Console.WriteLine("--- All Loaded Configuration ---");

// Iterate through the top-level sections
foreach (var section in builder.Configuration.GetChildren())
{
    PrintSection(section, "");
}

void PrintSection(IConfigurationSection section, string prefix)
{
    // Print the value if it's a direct key-value pair
    if (section.Value != null)
    {
        Console.WriteLine($"{prefix}{section.Key}: {section.Value}");
    }

    // Recursively print nested sections
    foreach (var child in section.GetChildren())
    {
        PrintSection(child, prefix + section.Key + ":");
    }
}


var frontendUrl = builder.Configuration["FrontendUrl"];
if (string.IsNullOrEmpty(frontendUrl))
{
    throw new InvalidOperationException("Frontend URL is not configured in appsettings.json.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(frontendUrl)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    );
});
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Engineering Work API", Version = "v1" });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description =
                "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

// Configure JWT Authentication
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            ),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = builder.Configuration["Jwt:RoleClaimType"],
            NameClaimType = builder.Configuration["Jwt:NameClaimType"],
        };

        // Handle preflight requests
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
                {
                    context.Token = String.Empty;
                }
                return Task.CompletedTask;
            }
        };
    });

// Configure Authorization
builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .Build();

    options.AddPolicy("RequireManagerRole", policy => policy.RequireRole("Manager"));
    options.AddPolicy("RequireTenantRole", policy => policy.RequireRole("Tenant"));
    options.AddPolicy("RequireTenantOrManagerRole", policy =>
    {
        policy.RequireAssertion(context =>
            context.User.IsInRole("Tenant") || context.User.IsInRole("Manager"));
    });
});

builder
    .Services.AddIdentity<User, IdentityRole>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DefaultConnection' not found in configuration."
    );
}

builder
    .Services.AddEntityFrameworkNpgsql()
    .AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));


// Configure Services
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<AccessService>();
builder.Services.AddScoped<TurnoverService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<CustomEmailSender>();


var app = builder.Build();

// Apply pending EF Core migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
