// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'https://iot-ust.live/v2/api',
    config: {
        logoUrl : '/assets/ust_logo_150x139.png',
		previewTagImgUrl : '/assets/default-tag-preview.dib',
        title : 'ESL Dashboard',
        sidebar : {
            background : '#0073a6',
            fontColor: '#fff'
        },
        theme : {
            background : '#0073a6',
            summaryCardTextColor: '#efefefb5'
        },
        navs : {
            settings : {
                visible : true
            }
        },
        tabs : {
            dashboard : {
                visible : true
            },
            commission : {
                visible : true,
                tabs : {
                    singleCommission: {
                        visible : true
                    },
                    bulkCommission : {
                        visible : true
                    },
                    tagDetails : {
                        visible : true
                    }
                }
            },
            priceUpdates : {
                visible : true,
                tabs : {
                    bulkPriceUpdate: {
                        visible : true
                    },
                    eslUpdate : {
                        visible : true
                    },
                    priceUpdate : {
                        visible : true
                    },
                    priceRefresh : {
                        visible : true
                    },
                    priceRetry : {
                        visible : true
                    }
                }
            },
            decommission : {
                visible : true,
                tabs : {
                    decommission: {
                        visible : true
                    },
                    bulkDecommission : {
                        visible : true
                    }
                }
            },
            downloads : {
                visible : true
            },
            gateway : {
                visible : true
            },
            designer : {
                visible : true,
                tabs : {
                    templateList: {
                        visible : true
                    },
                    tagDesigner : {
                        visible : true
                    }
                }
            },
        }
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
