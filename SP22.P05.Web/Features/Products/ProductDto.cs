﻿using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Products;

public class ProductDto
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Blurb { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    public decimal? SalePrice { get; set; }

    public DateTimeOffset? SaleEndUtc { get; set; }
    public string? PublisherName { get; set; }
    public int? Status { get; set; }
    public bool? IsInLibrary { get; set; }
    public string? FileName { get; set; } = string.Empty;
    public string? IconName { get; set; } = string.Empty;
    public string[] Pictures { get; set; } = Array.Empty<string>();

}