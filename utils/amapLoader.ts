
interface AMapConfig {
    key: string;
    securityJsCode: string;
    version?: string;
    plugins?: string[];
}

// 声明全局 window 对象上的 AMap 属性，防止 TS 报错
declare global {
    interface Window {
        AMap: any;
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

export const loadAMap = (config: AMapConfig): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap);
            return;
        }

        // 设置安全密钥 (AMap JS API v2.0 2021年12月02日之后申请的key需要配合安全密钥使用)
        window._AMapSecurityConfig = {
            securityJsCode: config.securityJsCode,
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://webapi.amap.com/maps?v=${config.version || '2.0'}&key=${config.key}&plugin=${(config.plugins || []).join(',')}`;

        script.onerror = (err) => {
            reject(err);
        };

        script.onload = () => {
            if (window.AMap) {
                resolve(window.AMap);
            } else {
                reject(new Error('AMap JS API load failed'));
            }
        };

        document.head.appendChild(script);
    });
};
