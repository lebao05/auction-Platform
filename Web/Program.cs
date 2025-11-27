using Application;
using Application.Behaviors;
using Domain.Entities;
using FluentValidation;
using Infraestructure;
using Infraestructure.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Presentation;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Configure MediatR and Pipeline Behaviors
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehavior<,>)); 


// Add controllers (including external assembly)
builder.Services
    .AddControllers()
    .AddApplicationPart(typeof(Presentation.Controllers.AuthController).Assembly);

// Configure Identity
builder.Services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
builder.Services.AddEndpointsApiExplorer(); // add api explore 
builder.Services.AddSwaggerGen(); // add service for document generator
// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();



// Add your custom dependency injections
builder.Services.AddApplicationDependencies()
                .AddInfrastructureDependencies()
                .AddPresentationDependencies();

var app = builder.Build();

// Middleware
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // create document

    app.UseSwaggerUI(options =>
    {
        // Correct path for Swagger JSON
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        options.RoutePrefix = string.Empty; // optional: serve UI at root "/"
    }); // indicate path for ui and json
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapStaticAssets(); // if you have static assets
app.MapControllers();   // map API controllers

app.Run();
