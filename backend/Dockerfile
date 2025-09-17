# Etap 1: baza runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

# Etap 2: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# kopiujemy tylko csproj żeby cache działał
COPY backend/backend.csproj ./backend/
RUN dotnet restore ./backend/backend.csproj

# kopiujemy resztę backendu
COPY backend/ ./backend
WORKDIR /src/backend
RUN dotnet publish backend.csproj -c Release -o /app/publish /p:UseAppHost=false

# Etap 3: finalny obraz
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
