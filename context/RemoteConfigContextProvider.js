import React, { useState, useEffect } from "react";
import { RemoteConfigContext } from "./RemoteConfigContext";
import remoteConfig from "@react-native-firebase/remote-config";
import configDefaults from "./remote-config.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const REMOTE_CONFIG = 'REMOTE_CONFIG';

export const RemoteConfigContextProvider = (props) => {

    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(configDefaults);

    useEffect(() => {

        const setRemoteConfigSettings = async () => {
            //TODO change interval to something reasonable maybe 30000(5minutes), 0 is for development purposes
            await remoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: 0,
            })
        }
        //Get only valid key:values from storage
        const getStoredConfig = async () => {
            const previousConfig = await AsyncStorage.getItem(REMOTE_CONFIG);
            if(previousConfig) {
                const storedConfig = JSON.parse(previousConfig);
                const validConfigs = Object.keys(configDefaults).reduce((acc, configKey) => {
                    if(storedConfig[configKey] !== undefined) {
                        return {...acc, ...{[configKey] : storedConfig[configKey]}}
                    }
                    return acc;
                }, {})
                return validConfigs;
            }
            return {}
        }

        const setPreviousConfig = async () => {
            const storedConfig = await getStoredConfig()
            const mergedConfig = {
                ...config,
                ...storedConfig
            };
            setConfig(mergedConfig)
            console.log('merged default config with stored:', mergedConfig)
        }
        //Get only valid key:values from remote
        //TODO we need to check if values from remote that are not defined in defaults will appear
        // if that's not the case there is no need to do the check: if(configDefaults[key] !== undefined)
        const getRemoteValues = () => {
            const parameters = remoteConfig().getAll();
            const remoteValues = Object.entries(parameters).reduce((acc, curr) => {
                const [key, entry] = curr;
                if(configDefaults[key] !== undefined) {
                    let value = entry.asString()
                    let isJSON = true;
                    try {
                        JSON.parse(value)
                    } catch {
                        isJSON = false
                    }
                    if(!isNaN(parseFloat(value))) {
                        value = entry.asNumber()
                    }else if(value === 'true' || value === 'false') {
                        value = entry.asBoolean()
                    }else if(isJSON){
                        value = JSON.parse(value)
                    }
                    return {...acc, ...{[key]: value}}
                }
                return acc;
            }, {});
            return remoteValues
        }
        const applyRemoteConfig = async () => {
            const remoteValues = getRemoteValues();
            const newConfig = {
                ...config,
                ...remoteValues,
            }
            setConfig(newConfig)
            await AsyncStorage.setItem(
                REMOTE_CONFIG,
                JSON.stringify(newConfig)
            );
            console.log('merged stored config with remote:', newConfig)
        }

        const setup = async () => {
            await setRemoteConfigSettings()
            await setPreviousConfig()
        }

        setup().then(() => {
            //TODO that gives a warning that we are passing json object instead of a string,
            // we need to check what needs to be passed
            remoteConfig().setDefaults(config)
                .then(() => remoteConfig().fetchAndActivate())
                .then(async fetchedRemotely => {
                    if (!fetchedRemotely) {
                        console.log('No remote config fetched, using the defaults')
                        setLoading(false)
                        return;
                    }
                    await applyRemoteConfig();
                    setLoading(false)
                })
                .catch((e) => {
                    setLoading(false)
                })
        }).catch((e) => {
            console.log(e)
        });
    }, [])

    const context = {
        loading,
        ...config
    };

    return (
        <RemoteConfigContext.Provider value={context}>
            {props.children}
        </RemoteConfigContext.Provider>
    );
};
