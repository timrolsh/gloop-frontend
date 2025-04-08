import {Endpoints} from "~/consts/endpoints";
import {ImplementationException} from "~/consts/exceptions";

export class Endpoint {
  endpoints = [];

  constructor() {
    for (const [key, value] of Object.entries(Endpoints)) this.register(key, value);
  }

  register(module, _endpoints) {
    _endpoints.forEach((e) =>
      this.endpoints.push({
        module: module,
        name: e.name,
        address: e.address,
        noTrailingSlash: true // Remove trailing slash for all endpoints
      })
    );
  }

  getUrl(name, ...args) {
    const endpoint = this.endpoints.find((e) => e.name === name);

    if (!endpoint)
      throw new ImplementationException(`[ENDPOINTS] Couldn't find ${name} endpoint!`, {
        name,
        ...args
      });

    return this.prepareAddress(endpoint, ...args);
  }

  prepareAddress(endpoint, ...args) {
    const _endpoint =
      typeof endpoint.address === "function"
        ? `${endpoint.module}/${endpoint.address(...args)}`
        : `${endpoint.module}/${endpoint.address}`;
    if (endpoint.noTrailingSlash) {
      return _endpoint.endsWith("/") ? _endpoint.slice(0, -1) : _endpoint;
    } else {
      return _endpoint.endsWith("/") ? _endpoint : _endpoint + "/";
    }
  }
}

const _endpoint = new Endpoint();

export default _endpoint;
