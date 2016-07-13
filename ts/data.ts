function yaml(path: string): any {
    return require('json!yaml!../data/' + path)
}

export default function getData() {
    const booths = yaml('booths.yaml');
    return [
        yaml('camera-hire.yaml'),
        yaml('magical-mirror.yaml'),
        yaml('the-wall.yaml'),
        booths['the-pod'],
        booths['mini-pod'],
        booths['the-cab'],
        yaml('event-photography.yaml')
    ];
}