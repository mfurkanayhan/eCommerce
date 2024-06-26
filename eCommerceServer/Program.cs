// IoC Container => Inversion Of Control

// Startup.cs
// Dependency Injection
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(configure =>
{
    configure.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new()
    {
        // Values we want to validate in the token..

        ValidateIssuer = true, // This is set to "true" to ensure that the Issuer value in the token is checked, and if it is incorrect, it will throw an error.

        ValidateAudience = true, // This ensures that the Audience value is checked.

        ValidateLifetime = true, // This is set to "true" if we want to check the expiration time and ensure that expired tokens do not work. If we want to create a token that works indefinitely, this value can be set to "false".

        ValidateIssuerSigningKey = true, // This option determines whether to check the security key that we will create.

        // Then we set the "Default" values for these fields.
        ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value, // This value must be the same as the value we gave when creating the token.

        ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value, // This value must match the audience value set when the token was created.

        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:SecretKey").Value ?? ""))
    };
});

// Middleware
var app = builder.Build();

// The project consists of 3 stages:
// Development -> Test -> Production

// To show Swagger only in the "Development" stage:
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
