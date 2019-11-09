/* eslint-disable */

export default {

    browser: [
        {
            name: 'chrome',
            rules: [
                /(?!chrom.*opr)chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
                /crios\/([0-9\.]+)(:?\s|$)/
            ]
        },
        {
            name: 'safari',
            rules: [
                /version\/([0-9\._]+).*safari/
            ]
        },
        {
            name: 'firefox',
            rules: [
                /firefox\/([0-9\.]+)(?:\s|$)/,
                /fxios\/([0-9\.]+)/
            ]
        },
        {
            name: 'facebook',
            rules: [
                /fbav\/([0-9\.]+)/
            ]
        },
        {
            name: 'instagram',
            rules:[
                /instagram\ ([0-9\.]+)/
            ]
        },
        {
            name: 'edge',
            rules: [
                /edge\/([0-9\._]+)/
            ]
        },
        {
            name: 'ie',
            rules: [
                /trident\/7\.0.*rv\:([0-9\.]+).*\).*gecko$/,
                /msie\s([0-9\.]+);.*trident\/[4-7].0/,
                /msie\s(7\.0)/
            ]
        },
        {
            name: 'opera',
            rules: [
                /opera\/([0-9\.]+)(?:\s|$)/,
                /opr\/([0-9\.]+)(:?\s|$)$/
            ]
        },
        {
            name: 'phantomjs',
            rules: [
                /phantomjs\/([0-9\.]+)(:?\s|$)/
            ]
        }
    ],
    
    mobileOs: [
        {
            name: 'android',
            rules: [
                /android/
            ]
        },
        {
            name: 'ios',
            rules: [
                /ip(hone|od|ad)/
            ]
        },
        {
            name: 'windows',
            rules: [
                /iemobile/
            ]
        }
    ],

    type: [
        {
            name: 'mobile',
            rules: [
                /(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/
            ]
        },
        {
            name: 'tablet',
            rules: [
                /(ipad|android(?!.*mobile)|tablet)/
            ]
        },
        {
            name: 'tv',
            rules: [
                /googletv|sonydtv/
            ]
        }
    ]
    
}