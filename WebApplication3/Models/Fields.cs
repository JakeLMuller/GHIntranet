using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class Fields
    {
        public string Id { get; set; }
        public string PolicyNumber { get; set; }
        public string PolicyFolder { get; set; }
        public string SharepointId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Author { get; set; }
        public string LastModified { get; set; }
        public string Editor { get; set; }
        public string Title { get; set; }
        public string Concurrer { get; set; }
        public string CheckedOut { get; set; }
        public string CreatedOn { get; set; }
        public string DueTime { get; set; }
        public string AutoApprove { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string DocumentContents { get; set; }
        public string SharepointFilePath { get; set; }
        public string PDFFilePath { get; set; }
        public string Concurrers { get; set; }
        public string Approver { get; set; }

        public string ConcurrersLong { get; set; }
        public string ApproverLong { get; set; }
        public string RelatedDocs { get; set; }
    }
}