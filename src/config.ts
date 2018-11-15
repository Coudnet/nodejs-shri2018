interface IConfig {
    port: number;
    portCORSAllow: number;
}

const config: IConfig = {
    port: 8000,
    portCORSAllow: 3000,
};

export {config};
