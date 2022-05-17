using FileHelpers;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace ORUKTaxonomy.Web.Models
{
    [DelimitedRecord(",")]
    public class Taxonomy
    {
        public string ID { get; private set; }
        [FieldHidden]
        public string Vocabulary { get; private set; }
        public Taxonomy() { }
        public Taxonomy(string id, string vocabulary)
        {
            ID = Regex.Match(id, @"\d+").Value;
            Vocabulary = vocabulary;
        }
    }
}
