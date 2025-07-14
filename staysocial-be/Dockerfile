# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY staysocial-be.sln ./
COPY staysocial-be/*.csproj ./staysocial-be/
RUN dotnet restore

COPY staysocial-be/. ./staysocial-be/
WORKDIR /app/staysocial-be
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/staysocial-be/out ./
EXPOSE 5000
ENTRYPOINT ["dotnet", "staysocial-be.dll"]
