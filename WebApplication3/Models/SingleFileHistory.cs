using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class SingleFileHistory
    {
        public string PolicyId { get; set; }

        public string FileName { get; set; }
        public string Date { get; set; }
        public string FilePath { get; set; }
        public string PDFPath { get; set; }
        public string Id { get; set; }
    }
}