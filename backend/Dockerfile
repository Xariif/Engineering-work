FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore backend.csproj
RUN dotnet publish backend.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
RUN echo '${{ secrets.APPSETTINGS_PROD_JSON }}' > ./backend/appsettings.Production.json
ENTRYPOINT ["dotnet", "backend.dll"]

