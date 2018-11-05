export interface IApplicationParams {
    type: string;
    page: number;
}

export interface IDataSmartHomeEvents {
    events: ISmartHomeEvent[];
}

export interface ISmartHomeEvent {
    type: string;
    title: string;
    source: string;
    time: string;
    description: string;
    icon: string;
    size: string;
    data?: IEventTemperatureData | IEventMusicData | IEventButtonsData | IEventImageData | IEventStatData;
}

export interface IEventStatDataValues {
    name: string;
}

export interface IEventStatData {
    type: string;
    values: IEventStatDataValues[];
}

export interface IEventImageData {
    image: string;
}

export interface IEventButtonsData {
    buttons: string[];
}

export interface IEventTemperatureData {
    temperature: number;
    humidity: number;
}

export interface IEventMusicData {
    albumcover: string;
    artist: string;
    track: ITrackInfo;
    volume: number;
}

export interface ITrackInfo {
    name: string;
    length: string;
}

export interface IApplicationInternalError {
    errno: number;
    message: string;
}
