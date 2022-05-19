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
        public string Name { get; private set; }
        public string Vocabulary { get; private set; }
        public Taxonomy() { }
        public Taxonomy(string id, string name, string vocabulary)
        {
            ID = id;
            Name = name;
            Vocabulary = vocabulary;
        }
    }
}
