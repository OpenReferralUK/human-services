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

import java.util.List;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author dominic.skinner
 */
public class Main {
    public static void main(String[] args) throws IOException {
        List chainrSpecJSON = JsonUtils.classpathToList( "/spec.json" );
        Chainr chainr = Chainr.fromSpec( chainrSpecJSON );

        Object inputJSON = JsonUtils.classpathToObject( "/ExtendedDataPackage.json" );

        Object transformedOutput = chainr.transform( inputJSON );
        FileUtils.writeStringToFile(new File("output.json"), JsonUtils.toJsonString( transformedOutput ));
    }
}
