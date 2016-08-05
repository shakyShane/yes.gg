import {Service} from "./book";

function yaml(path: string): any {
    return require('json!yaml!../data/services/' + path)
}

let serviceId = 0;

function applyId(service: Service) {
    service.id = String(serviceId++);
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

    // Fun props has 3 separate prices
    // so we turn them into individual elements
    const props = yaml('fun-props.yaml');
    const items = props.prices.map(function (item) {
        return {
            title: `${props.title} - ${item.content}`,
            price: item
        };
    });

    const out = <ServiceGroups>{
        "photoBooths": {
            title: "Photo Booths",
            items: [
                yaml('booths-the-pod.yaml'),
                yaml('booths-the-cab.yaml'),
                yaml('booths-mini-pod-01.yaml'),
                yaml('booths-mini-pod-02.yaml'),
            ]
                .map(applyId)
                .map(applyIdsToExtras)
        },
        "other": {
            title: "Other Services",
            items: [
                yaml('event-photography.yaml'),
                yaml('camera-hire.yaml'),
                yaml('magical-mirror.yaml'),
                yaml('the-wall.yaml'),
                ...items
            ]
                .map(applyId)
                .map(applyIdsToExtras)
        }
    };

    return out;
}

function applyIdsToExtras (item) {
    if (!item.extras) item.extras = [];

    item.extras.forEach(function (extra, i) {
        extra.id = `${item.id}.${i}`;
    });

    return item;
}
