using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace RazorPagesMovie
{
    public class Program
    {
        public static void Main(string[] args)
        {
            MachineLearning.getInstance().init();
            MachineLearning.getInstance().classify();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}

