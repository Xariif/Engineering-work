using System;

namespace backend.Models.Access.Response;

public class GetAccessData
{
    public List<Mall> Malls { get; set; } = new List<Mall>();

}


public class Mall
{
    public string Name { get; set; }
    public string Address { get; set; }
    public List<Store> Stores { get; set; } = new List<Store>();
}

public class Store
{
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public List<Access> Accesses { get; set; } = new List<Access>();
}

public class Access
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string UserEmail { get; set; }
}

