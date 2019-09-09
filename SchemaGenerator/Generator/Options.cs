using CommandLine;

namespace Convertor
{
    public class Options
    {
        [Option('f', "filter", Required = false, HelpText = "Profile to filter on 0 = All, 1 = Open Referral, 2 = Service Directory")]
        public int Filter { get; set; }

        [Option('t', "type", Required = false, HelpText = "Type of file to export on gv = ERD, json = JSON Schema, table = JSON Table Schema, csv = CSV Schema, sql = Create Table Statements, html = HTML documentation")]
        public string ExportType { get; set; }

        [Option('r', "ref", Required = false, HelpText = "Frame of reference for export")]
        public string ReferenceTable { get; set; }

        [Option('v', "verbose", Required = false, HelpText = "1 if the output should be verbose")]
        public int Verbose { get; set; }

        [Option('t', "title", Required = false, HelpText = "The title that should be used for the document")]
        public string Title { get; set; }

        [Option('m', "multiple", Required = false, HelpText = "1 if the intial object should be expressed as multiple objects")]
        public int Multiple { get; set; }

        [Option('e', "engine", Required = false, HelpText = "The database engine to use. 1 = MySQL, 2 = SQL Server")]
        public int Engine { get; set; }

        [Option('o', "output", Required = false, HelpText = "The path the output should be exported to")]
        public string Output { get; set; }

        [Option('d', "deprecated", Required = false, HelpText = "1 if deprecated fields should be included")]
        public int IncludeDeprecated { get; set; }
    }
}
