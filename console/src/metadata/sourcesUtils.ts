import { Driver } from '../dataSources';

export const addSource = (
  driver: Driver,
  payload: {
    name: string;
    dbUrl: string | { from_env: string };
    connection_pool_settings?: {
      max_connections?: number;
      idle_timeout?: number;
      retries?: number;
    };
  }
) => {
  if (driver === 'mssql') {
    return {
      type: 'mssql_add_source',
      args: {
        name: payload.name,
        configuration: {
          connection_info: {
            connection_string: payload.dbUrl,
            pool_settings: payload.connection_pool_settings,
          },
        },
      },
    };
  }

  return {
    type: 'pg_add_source',
    args: {
      name: payload.name,
      configuration: {
        connection_info: {
          database_url: payload.dbUrl,
          pool_settings: payload.connection_pool_settings,
        },
      },
    },
  };
};

export const removeSource = (driver: Driver, name: string) => {
  let prefix = '';
  switch (driver) {
    case 'mssql':
      prefix = 'mssql_';
      break;
    case 'mysql':
      prefix = 'mysql_';
      break;
    default:
      prefix = 'pg_';
  }

  return {
    type: `${prefix}drop_source`,
    args: {
      name,
    },
  };
};

export const reloadSource = (name: string) => {
  return {
    type: 'reload_metadata',
    args: {
      reload_sources: [name],
    },
  };
};
