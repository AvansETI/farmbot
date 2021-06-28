using System;
using OpenCvSharp;
using System.IO;

namespace RazorPagesMovie
{
    public class Camera
    {
        static readonly string _assetsPath = Path.Combine(Environment.CurrentDirectory, "assets");
        static readonly string _wwwrootPath = Path.Combine(Environment.CurrentDirectory, "wwwroot");
        static readonly string _rootassetFolder = Path.Combine(_wwwrootPath, "assets");
        static readonly string _rootimagesFolder = Path.Combine(_rootassetFolder, "images");
        static readonly string _imagesFolder = Path.Combine(_assetsPath, "images");
        static readonly string _imagepath = string.Format("{0}\\cam.jpg", _imagesFolder, "images");
        static readonly string _rootimagepath = string.Format("{0}\\cam.jpg", _rootimagesFolder, "images");

        VideoCapture cap;

        public void Init()
        {
            cap = new VideoCapture(0);
        }

        public Mat Capture(bool save)
        {
            Mat img = new Mat();
            cap.Read(img);
            if (save)
            {
                img.SaveImage(_imagepath);
                img.SaveImage(_rootimagepath);
            }
            return img;
        }

        public void ShowImage(Mat image)
        {
            Cv2.Flip(image, image, FlipMode.Y);
            Cv2.ImShow("img", image);
        }
        public void Release()
        {
            Cv2.DestroyAllWindows();
        }
    }
}
