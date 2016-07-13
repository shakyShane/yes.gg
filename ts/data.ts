import {Service} from "./book";

function yaml(path: string): any {
    return require('json!yaml!../data/' + path)
}
let serviceId = 0;
function applyId(service: Service) {
    service.id = serviceId++;
    return service;
}
export interface ServiceGroup {
    title: string,
    items: Array<Service>
}
export interface ServiceGroups {
    [serviceName: string]: ServiceGroup
}

export default function getData(): ServiceGroups {
    const out = <ServiceGroups>{
        "photoBooths": {
            title: "Photo Booths",
            items: [
                yaml('booths-the-pod.yaml'),
                yaml('booths-the-cab.yaml'),
                yaml('booths-mini-pod-01.yaml'),
                yaml('booths-mini-pod-02.yaml')
            ].map(applyId)
        },
        "other": {
            title: "Other Services",
            items: [
                yaml('event-photography.yaml'),
                yaml('camera-hire.yaml'),
                yaml('magical-mirror.yaml'),
                yaml('the-wall.yaml')
            ].map(applyId)
        }
    };

    return out;
}
