using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class ConcurItem
    {
        public string DocId { get; set; }
        public string Id { get; set; }
        public string username { get; set; }
        public string userId { get; set; }
        public string DueDate { get; set; }
        public string StartDate { get; set; }
        public string Status { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string CreatedOn { get; set; }
        public string RejectionReason { get; set; }
        public string DeadLine { get; set; }
        public string ApproveComments { get; set; }
        public string AllConcurrers { get; set; }
        public string AllConcurrerIds { get; set; }
        public string PercentComplete { get; set; }
        public string Email { get; set; }
        public string Initiator { get; set; }
        public string Approver { get; set; }
    }
}