export const environment = {
    production: true,
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
