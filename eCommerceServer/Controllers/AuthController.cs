using AutoMapper;
using eCommerceServer.DTOs;
using eCommerceServer.Models;
using eCommerceServer.Repositories;
using eCommerceServer.Services;
using eCommerceServer.Validators;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceServer.Controllers;
[Route("api/[controller]/[action]")]
[ApiController]
public sealed class AuthController : ControllerBase
{
    private readonly IMapper _mapper;
    AppUserRepository appUserRepository;
    IConfiguration _configuration;
    public AuthController(IMapper mapper, IConfiguration configuration)
    {
        _mapper = mapper;
        appUserRepository = new AppUserRepository();
        _configuration = configuration;
    }

    [HttpPost]
    public IActionResult Register(RegisterDto request)
    {
        // Business Rules
        // Validation Check
        RegisterDtoValidator validator = new();
        ValidationResult result = validator.Validate(request);
        if (!result.IsValid)
        {
            List<string> errorMessages = result.Errors.Select(s => s.ErrorMessage).ToList();
            return StatusCode(422, errorMessages);
        }

        // Unique Record Check
        bool isEmailExist = appUserRepository.IsEmailExists(request.Email);
        if (isEmailExist)
        {
            return BadRequest(new { Message = "Email address already registered!" });
        }

        // Object Creation
        AppUser appUser = _mapper.Map<AppUser>(request);

        // Database Record Creation
        appUserRepository.Add(appUser);

        return NoContent();
    }

    [HttpPost]

    public IActionResult Login(LoginDto request)
    {
        // Validation Check
        LoginDtoValidator validator = new();
        ValidationResult result = validator.Validate(request);

        if (!result.IsValid)
        {
            List<string> errorMessages = result.Errors.Select(s => s.ErrorMessage).ToList();
            return StatusCode(422, errorMessages);
        }

        // User Check
        AppUser? user = appUserRepository.Login(request.Email, request.Password);

        if (user is null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        // Token - We will generate token with JWT
        JwtProvider jwtProvider = new(_configuration);
        string token = jwtProvider.CreateToken(user);

        return Ok(new {AccessToken = token});
    }
}