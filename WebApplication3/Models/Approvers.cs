using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class Approvers
    {
        public string ApproverName { get; set; }

        public string DocId { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }

        public string PercentComplete { get; set; }
        public string Title { get; set; }
        public string PDFFilePath { get; set; }
        public string ApproverID { get; set; }
    }
}