using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Turnover
{
    public class TurnoverRequest
    {
        [Required]
        public int TenantId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Value { get; set; }

        [Required]
        [CustomDateValidation]
        public DateTime Date { get; set; }
    }

    public class CustomDateValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is DateTime date)
            {
                var today = DateTime.UtcNow.Date;
                var currentYear = DateTime.UtcNow.Year;

                if (date.Year != currentYear)
                {
                    return new ValidationResult($"Turnover can only be added for the current year ({currentYear})");
                }

                if (date.Date > today)
                {
                    return new ValidationResult("Turnover date cannot be in the future");
                }

                return ValidationResult.Success;
            }

            return new ValidationResult("Invalid date format");
        }
    }
} 