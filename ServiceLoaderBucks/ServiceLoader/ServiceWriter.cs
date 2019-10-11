﻿using MySql.Data.MySqlClient;
using NLog;
using ServiceLoader.JsonMappingObjects;
using System;
using System.Configuration;
using System.Data;

namespace ServiceLoader
{
    internal class ServiceWriter : IDisposable
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly MySqlConnection _connection;

        public ServiceWriter()
        {
            _connection = new MySqlConnection(ConfigurationManager.ConnectionStrings["ServiceDirectory"].ConnectionString);
            _connection.Open();
        }

        internal void Write(Result[] results)
        {
            foreach (var result in results)
            {
                try
                {
                    WriteOrganisation(result);
                    WriteService(result);
                    WriteServiceArea(result);
                    WriteLocation(result);
                    WriteServiceAtLocation(result);
                    WriteTaxonomies(result);
                    WriteServiceTaxonomies(result);
                    WriteContact(result);
                    WritePhone(result);
                    WriteAddress(result);
                    WriteSchedule(result);
                    WriteCostOption(result);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    Logger.Error(e);
                }
            }
        }

        private void WriteCostOption(Result result)
        {
            if (string.IsNullOrEmpty(result.Price)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO cost_option(id, service_id, amount)
VALUES (@id, @service_id, @amount)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.CostOptionId;
                command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                command.Parameters.Add("@amount", MySqlDbType.Text).Value = result.Price;
                command.ExecuteNonQuery();
            }
        }

        private void WriteSchedule(Result result)
        {
            foreach (var schedule in result.Schedules)
            {
                using (var command = _connection.CreateCommand())
                {
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"
INSERT INTO regular_schedule(id, service_id, service_at_location_id, byday, description)
VALUES (@id, @service_id, @service_at_location_id, @byday, @description)
ON DUPLICATE KEY UPDATE id = id;
";
                    command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = schedule.Id;
                    command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                    command.Parameters.Add("@service_at_location_id", MySqlDbType.VarChar, 1536).Value = result.ServiceAtLocationId;
                    command.Parameters.Add("@byday", MySqlDbType.Text).Value = schedule.Day;
                    command.Parameters.Add("@description", MySqlDbType.Text).Value = schedule.Description;
                    command.ExecuteNonQuery();
                }
            }
        }

        private void WriteAddress(Result result)
        {
            if (string.IsNullOrEmpty(result.LocationId)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO physical_address(id, location_id, address_1, city, postal_code, state_province, country)
VALUES (@id, @location_id, @address_1, @city, @postal_code, @state_province, @country)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.AddressId;
                command.Parameters.Add("@location_id", MySqlDbType.VarChar, 1536).Value = result.LocationId;
                command.Parameters.Add("@address_1", MySqlDbType.Text).Value = result.AddressLine1;
                command.Parameters.Add("@city", MySqlDbType.Text).Value = result.AddressCity;
                command.Parameters.Add("@postal_code", MySqlDbType.Text).Value = result.AddressPostCode;
                command.Parameters.Add("@state_province", MySqlDbType.Text).Value = result.AddressStateProvince;
                command.Parameters.Add("@country", MySqlDbType.Text).Value = result.AddressCountry;
                command.ExecuteNonQuery();
            }
        }

        private void WritePhone(Result result)
        {
            if (string.IsNullOrEmpty(result.Phone)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO phone(id, contact_id, number)
VALUES (@id, @contact_id, @number)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.ContactId;
                command.Parameters.Add("@contact_id", MySqlDbType.VarChar, 1536).Value = result.ContactId;
                command.Parameters.Add("@number", MySqlDbType.Text).Value = result.Phone;
                command.ExecuteNonQuery();
            }
        }

        private void WriteContact(Result result)
        {
            if (string.IsNullOrEmpty(result.ContactId)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO contact(id, service_id, name)
VALUES (@id, @service_id, @name)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.ContactId;
                command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                command.Parameters.Add("@name", MySqlDbType.Text).Value = result.ContactName;
                command.ExecuteNonQuery();
            }
        }

        private void WriteServiceTaxonomies(Result result)
        {
            foreach (var taxonomy in result.Taxonomies)
            {
                using (var command = _connection.CreateCommand())
                {
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"
INSERT INTO service_taxonomy(id, service_id, taxonomy_id)
VALUES (@id, @service_id, @taxonomy_id)
ON DUPLICATE KEY UPDATE id = id;
";
                    command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = $"{result.ServiceId}:{taxonomy.Id}";
                    command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                    command.Parameters.Add("@taxonomy_id", MySqlDbType.VarChar, 1536).Value = taxonomy.Id;
                    command.ExecuteNonQuery();
                }
            }
        }

        private void WriteTaxonomies(Result result)
        {
            foreach (var taxonomy in result.Taxonomies)
            {
                using (var command = _connection.CreateCommand())
                {
                    command.CommandType = CommandType.Text;
                    command.CommandText = @"
INSERT INTO taxonomy(id, name, vocabulary)
VALUES (@id, @name, @vocabulary)
ON DUPLICATE KEY UPDATE id = id;
";
                    command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = taxonomy.Id;
                    command.Parameters.Add("@name", MySqlDbType.Text).Value = taxonomy.Name;
                    command.Parameters.Add("@vocabulary", MySqlDbType.Text).Value = taxonomy.Vocabulary;
                    command.ExecuteNonQuery();
                }
            }
        }

        private void WriteServiceAtLocation(Result result)
        {
            if (string.IsNullOrEmpty(result.ServiceAtLocationId)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO service_at_location(id, service_id, location_id)
VALUES (@id, @service_id, @location_id)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.ServiceAtLocationId;
                command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                command.Parameters.Add("@location_id", MySqlDbType.VarChar, 1536).Value = result.LocationId;
                command.ExecuteNonQuery();
            }
        }

        private void WriteLocation(Result result)
        {
            if (string.IsNullOrEmpty(result.LocationId)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO location(id, name, description, latitude, longitude)
VALUES (@id, @name, @description, @latitude, @longitude)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.LocationId;
                command.Parameters.Add("@name", MySqlDbType.Text).Value = result.LocationName;
                command.Parameters.Add("@description", MySqlDbType.Text).Value = result.LocationDescription;
                command.Parameters.Add("@latitude", MySqlDbType.Double).Value = result.LocationLatitude;
                command.Parameters.Add("@longitude", MySqlDbType.Double).Value = result.LocationLongitude;
                command.ExecuteNonQuery();
            }
        }

        private void WriteServiceArea(Result result)
        {
            if (string.IsNullOrEmpty(result.Area)) return;
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO service_area(id, service_id, service_area)
VALUES (@id, @service_id, @service_area)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.ServiceAreaId;
                command.Parameters.Add("@service_id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                command.Parameters.Add("@service_area", MySqlDbType.Text).Value = result.Area;
                command.ExecuteNonQuery();
            }
        }

        private void WriteService(Result result)
        {
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO service(id, organization_id, name, description, url, email, status)
VALUES (@id, @organization_id, @name, @description, @url, @email, 'active')
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.ServiceId;
                command.Parameters.Add("@organization_id", MySqlDbType.VarChar, 1536).Value = result.OrganisationId;
                command.Parameters.Add("@name", MySqlDbType.Text).Value = result.ServiceName;
                command.Parameters.Add("@description", MySqlDbType.Text).Value = result.ServiceDescription;
                command.Parameters.Add("@url", MySqlDbType.Text).Value = result.Url;
                command.Parameters.Add("@email", MySqlDbType.Text).Value = result.Email;
                command.ExecuteNonQuery();
            }
        }

        private void WriteOrganisation(Result result)
        {
            using (var command = _connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = @"
INSERT INTO organization(id, name, description, url)
VALUES (@id, @name, @description, @url)
ON DUPLICATE KEY UPDATE id = id;
";
                command.Parameters.Add("@id", MySqlDbType.VarChar, 1536).Value = result.OrganisationId;
                command.Parameters.Add("@name", MySqlDbType.Text).Value = result.OrganisationName;
                command.Parameters.Add("@description", MySqlDbType.Text).Value = result.OrganisationDescription;
                command.Parameters.Add("@url", MySqlDbType.Text).Value = result.OrganisationUrl;
                command.ExecuteNonQuery();
            }
        }

        #region IDisposable
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    _connection.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}