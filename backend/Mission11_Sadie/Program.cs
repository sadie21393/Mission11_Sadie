using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Configuration
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5175", "https://mission13-sadie-backend-azd3hughgecxe5d4.westcentralus-01.azurewebsites.net") // React frontend URL
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Database Connection
var connectionString = builder.Configuration.GetConnectionString("BookConnection");

builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactApp",
    policy => {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins); // Add this line to apply CORS policy
app.UseAuthorization();
app.MapControllers();

app.Run();
