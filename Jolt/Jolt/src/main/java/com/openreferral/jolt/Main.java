/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.openreferral.jolt;

import com.bazaarvoice.jolt.Chainr;
import com.bazaarvoice.jolt.JsonUtils;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.System.out;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import java.util.List;
import org.apache.commons.io.FileUtils;
import org.apache.commons.cli.*;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author dominic.skinner
 */
public class Main {
    private static final String SPEC = "spec";
    private static final String INPUT = "input";
    private static final String OUTPUT = "ouput";
    
    public static void main(String[] args) throws IOException {
        
        Options options = new Options();

        Option input = new Option("i", INPUT, true, "input");
        input.setRequired(true);
        options.addOption(input);

        Option output = new Option("o", OUTPUT, true, "output");
        output.setRequired(true);
        options.addOption(output);

        Option spec = new Option("s", SPEC, true, "spec");
        spec.setRequired(true);
        options.addOption(spec);

        CommandLineParser parser = new DefaultParser();
        HelpFormatter formatter = new HelpFormatter();
        CommandLine cmd;

        try {
            cmd = parser.parse(options, args);
        } catch (ParseException e) {
            System.out.println(e.getMessage());
            formatter.printHelp("jolt", options);

            System.exit(1);
            return;
        }

        List chainrSpecJSON = JsonUtils.jsonToList(readURL(cmd.getOptionValue(SPEC)));
        Chainr chainr = Chainr.fromSpec( chainrSpecJSON );
        
        Object inputJSON = JsonUtils.jsonToObject(readURL(cmd.getOptionValue(INPUT)));

        Object transformedOutput = chainr.transform( inputJSON );
        FileUtils.writeStringToFile(new File(cmd.getOptionValue(OUTPUT)), JsonUtils.toJsonString( transformedOutput ));
    }
    
    private static InputStream readURL(String url) throws IOException
    {
        return new URL(url).openStream ();
    }
}
