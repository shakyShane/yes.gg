const $ = require('zepto/zepto.min.js');
const $body = $('body');
declare var __webpack_public_path__;
const assetPath = window['_superDenimCustom'].paths.assets;

export enum PageNames {
    Product = <any>'product',
    Category = <any>'category'
}

export function icon (name:string) {
    return `<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${assetPath}/svg/icons.svg#svg-${name}"></use></svg>`;
}

console.log(onPage(PageNames.Product));

export function onPage(name: PageNames): boolean {
    if (name === PageNames.Product) {
        return $body.hasClass('catalog-product-view');
    }
    if (name === PageNames.Category) {
        return $body.hasClass('catalog-category-view');
    }
    return false;
}
