using Convertor;
using Convertor.Models;
using System.Collections.Generic;

namespace Generator.Models
{
    public class Profile
    {
        internal string Name { get; private set; }
        internal string Moscow { get; private set; }
        internal string Notes { get; private set; }
        internal SchemaURI[] Schemas { get; private set; }

        public Profile(dynamic applicationProfile)
        {
            if (applicationProfile != null)
            {
                if (applicationProfile.name != null)
                {
                    Name = applicationProfile.name.Value;
                }
                if (applicationProfile.notes != null)
                {
                    Notes = applicationProfile.notes.Value;
                }
                if (applicationProfile.moscow != null)
                {
                    Moscow = applicationProfile.moscow.Value;
                }
                if (applicationProfile.schemes != null)
                {
                    List<SchemaURI> schemaUris = new List<SchemaURI>();
                    foreach (dynamic item in applicationProfile.schemes)
                    {
                        schemaUris.Add(new SchemaURI() { name = item.name, required = item.required, uri = item.uri });
                    }
                    Schemas = schemaUris.ToArray();
                }
            }
        }

        public static Profile[] Create(dynamic applicationProfiles)
        {
            if (applicationProfiles != null)
            {
                List<Profile> profiles = new List<Profile>();
                foreach (dynamic item in applicationProfiles)
                {
                    profiles.Add(new Profile(item));
                }
                return profiles.ToArray();
            }
            return null;
        }

        public static bool HasProfile(Profile[] profiles, string profileName)
        {
            if (profiles == null)
            {
                return false;
            }

            foreach (Profile profile in profiles)
            {
                if (profile.Name == profileName)
                {
                    return true;
                }
            }
            return false;
        }

        public static Profile GetProfile(Profile[] profiles, Options option)
        {
            if (profiles == null)
            {
                return null;
            }

            Profile defaultProfile = null;
            foreach(Profile profile in profiles)
            {
                if (profile.Name == "openReferral")
                {
                    defaultProfile = profile;
                }

                if (string.IsNullOrEmpty(profile.Name))
                {
                    defaultProfile = profile;
                }

                if (profile.Name == option.ApplicationProfile)
                {
                    return profile;
                }
            }
            return defaultProfile;
        }
    }
}
