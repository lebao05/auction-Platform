using Application;
using Application.Behaviors;
using Domain.Entities;
using Infraestructure;
using Infraestructure.BackgroundServices;
using Infraestructure.Options;
using Infraestructure.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Presentation;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Configure MediatR and Pipeline Behaviors
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehavior<,>));

// Outbox processor
builder.Services.AddHostedService<OutboxProcessor>();


var ClientUrl = builder.Configuration["ClientUrl"];
Console.WriteLine($"Client Url {ClientUrl}");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5125",   // Backend or Swagger UI
                 ClientUrl!    // Vite frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// JWT beear authentication can be configured here 

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// Add JWT auth
// Force JWT as the only auth scheme
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };

    // Prevent redirect from cookies
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    };
});


// Add controllers (including external assembly)
builder.Services
    .AddControllers()
    .AddApplicationPart(typeof(Presentation.Controllers.AuthController).Assembly);


// Configure Identity
builder.Services.AddIdentityCore<AppUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole<Guid>>()                  // add role support
.AddEntityFrameworkStores<ApplicationDbContext>() // EF Core store
.AddDefaultTokenProviders();

//Options
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));


//Add Swagger services
builder.Services.AddEndpointsApiExplorer(); // add api explore 
builder.Services.AddSwaggerGen(options =>
{
    //Add the security definition for Bearer

   options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
   {
       Name = "Authorization",
       Type = SecuritySchemeType.Http,
       Scheme = "bearer",
       BearerFormat = "JWT",
       In = ParameterLocation.Header,
       Description = "Enter 'Bearer' [space] and then your token.\nExample: \"Bearer eyJhbGci...\""
   });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

});

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

//Add Authorization services
builder.Services.AddAuthorization();


// Add your custom dependency injections
builder.Services.AddApplicationDependencies()
                .AddInfrastructureDependencies()
                .AddPresentationDependencies();

var app = builder.Build();
app.UseCors("AllowLocalhost");


app.UseSerilogRequestLogging();
app.UseStaticFiles(); // <-- place here

// Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // create document

    app.UseSwaggerUI(options =>
    {
        // Correct path for Swagger JSON
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        options.RoutePrefix = string.Empty; // optional: serve UI at root "/"
    }); // indicate path for ui and json
    app.UseHttpsRedirection();
}
else
{
    app.UseHsts();
}

app.UseRouting();

app.UseAuthentication();
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated ?? false)
    {
        var claims = context.User.Claims.Select(c => $"{c.Type}:{c.Value}");
        Log.Information("Authenticated user claims: {Claims}", string.Join(", ", claims));
    }
    await next();
});
app.UseAuthorization();
app.MapStaticAssets(); // if you have static assets
app.MapControllers();   // map API controllers

app.Run();
