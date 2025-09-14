FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore ./backend/backend.csproj
RUN dotnet publish ./backend/backend.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY ./backend/appsettings.Production.json ./appsettings.Production.json
ENTRYPOINT ["dotnet", "backend.dll"]