# Etap 1: Build
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src

# Kopiujemy plik csproj i przywracamy paczki
COPY backend/backend.csproj ./ 
RUN dotnet restore "./backend.csproj"

# Kopiujemy całą zawartość backendu
COPY backend/ ./ 

# Budujemy
RUN dotnet build "backend.csproj" -c $configuration -o /app/build

# Etap 2: Publish
FROM build AS publish
ARG configuration=Release
RUN dotnet publish "backend.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

# Etap 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
