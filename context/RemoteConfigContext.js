import React, { useContext } from "react";
import configDefaults from "./remote-config.config";

const RemoteConfigContextValues = {
    loading: false,
    ...configDefaults,
};

export const RemoteConfigContext = React.createContext(RemoteConfigContextValues);

export const useRemoteConfigContext = () => useContext(RemoteConfigContext);
