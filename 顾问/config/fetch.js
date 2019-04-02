 /* jshint esversion: 6 */ 
let baseUrl = 'http://rap2api.taobao.org/app/mock/22199';

if (process.env.NODE_ENV == 'development') {

}else if(process.env.NODE_ENV == 'production'){
	// baseUrl = 'http://rap2api.taobao.org/app/mock/22199';
}

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();

	if(process.env.NODE_ENV == 'production'){
		if(url.indexOf('/mall-portal') != -1){
			url = 'http://www.i51c.com' + url;
		} else {
			url = baseUrl + url;
		}
	};

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		};

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			});
		}

		if (type == 'PUT') {
			requestConfig = {
				withCredentials: true,
				method: 'PUT',
				headers: {
					'Content-Type': data.callback['contentType']
				},
				body: data.body
			};
		}
		
		try {
			const response = await fetch(url, requestConfig);
			if (response) {
				if (type != 'PUT') {
					const responseJson = await response.json();
					return responseJson;
				}
			}
		} catch (error) {
			throw new Error(error);
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject();
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response;
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj);
					} else {
						reject(requestObj);
					}
				}
			};
		});
	}
}