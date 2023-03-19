const tips = {
    1: '抱歉，出现了一个错误',
    1005:'appkey无效，请前往www.7yue.pro申请',
    3000:'期刊不存在'
}

class HTTP{
    request(params){
        // url, data, method,
        if(!params.method){
            params.method="GET"
        }
        wx.request({
            url: 'http://127.0.0.1:8080/' + params.url,
            method: params.method,
            data: params.data,
            header:{
                'content-type':'application/json',
            },
            success:(res)=>{
                let code = res.statusCode.toString()
                if (code.startsWith('2')){
                    params.success && params.success(res.data)
                }
                else{
                    let error_code = res.data.error_code
                    this._show_error(error_code)
                }
            },
            fail:(err)=>{
                this._show_error(1)
            }
        })
    }

    _show_error(error_code){
        if(!error_code){
            error_code = 1
        }
        const tip = tips[error_code]
        wx.showToast({
            title: tip?tip:tips[1], 
            icon:'none',
            duration:2000
        }) 
    }
}

export {HTTP}


















