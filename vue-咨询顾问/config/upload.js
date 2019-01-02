import fetch from './fetch'

export const upload1 = ( file ) => fetch('http://alpha-mall.7linkshop.com/mall-portal/sys/fc/applyForFileUploading', {
	applyCode: 'image',
    fileName: file.name
}, 'GET')

export const upload2 = ( res, file ) => fetch(res.data.uploadUrl, {
		body: file,
		callback: res.data
}, 'PUT')
