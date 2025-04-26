using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Reports
{
    // DTO for mall selection in the UI
    public class MallSelectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    // Request model for chart period selection
    public class ChartPeriodRequest
    {
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        // Optional list of tenant IDs to filter by
        public List<int> TenantIds { get; set; } = new List<int>();
    }
    
    // Tenant selection model for UI
    public class TenantSelectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
    }

    // Bar chart data model
    public class BarChartDataDTO
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<BarChartSeriesDTO> Series { get; set; } = new List<BarChartSeriesDTO>();
    }

    public class BarChartSeriesDTO
    {
        public string Name { get; set; }
        public List<decimal> Data { get; set; } = new List<decimal>();
    }

    // Line chart data model
    public class LineChartDataDTO
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<LineChartSeriesDTO> Series { get; set; } = new List<LineChartSeriesDTO>();
    }

    public class LineChartSeriesDTO
    {
        public string Name { get; set; }
        public List<decimal> Data { get; set; } = new List<decimal>();
    }

    // Pie chart data model
    public class PieChartDataDTO
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<decimal> Values { get; set; } = new List<decimal>();
        public List<string> Colors { get; set; } = new List<string>();
    }
} 