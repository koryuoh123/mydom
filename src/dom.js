// window.dom = {};
// window.dom.create = function(){};
// 等价于
//const childNodes = node.childNodes 等价于 const {childNodes} = node
window.dom ={
    create(string){
        const container = document.createElement("template")
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },
    after(node,node2){ //新增弟弟 （兄，弟）
        node.parentNode.insertBefore(node2, node.nextSibling);
        // 只有插在前面的方法，那么我插在test的弟弟的前面就相当于插在test的后面了
    },
    before(node,node2){ //新增哥哥 (兄，弟)
        node.parentNode.insertBefore(node2,node)// (后，前)
    },
    append(parent,node){//新增儿子 (父，子)
        parent.appendChild(node)
    },
    wrap(node,parent){//新增爸爸 (儿子，爸爸)
        dom.before(node,parent)// 让parent成为node的兄弟
        dom.append(parent,node)// 将node成为parent的儿子
    },
    remove(node){// 删除
        node.parentNode.removeChild(node) //不用remove()是因为IE不支持
        return node
    },
    empty(node){// 清掉所有儿子
        const array = []
        let x = node.firstChild
        while(x){
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    attr(node, name, value){ //重载 ,设置属性or读取属性
        if(arguments.length === 3){
            node.setAttribute(name, value)
        }else if(arguments.length === 2){
            return node.getAttribute(name)
        }
    },
    text(node, string){// 适配
        if(arguments.length ===2){
            if('innerText' in node){ //说明是IE
                node.innerText = string
            }else{
                node.textContent = string
            }
        }else if (arguments.length === 1){
            if('innerText' in  node){
                return node.innerText
            }else{
                return node.textContent
            }
        }

    },
    html(node, string){
        if(arguments.length === 2){
            node.innerHTML = string
        }else if(arguments.length === 1){
            return node.innerHTML
        }
    },
    style(node, name, value){
        if(arguments.length ===3){
            // dom.style(div,'color'.'red')
            node.style[name] = value //用node.style.name会变成字符串
        }
        else if(arguments.length ===2){
            if(typeof name === 'string'){
                // dom.style(div,'color')
                return node.style[name]
            }else if(name instanceof Object){
                // dom.style(div,{color:'red'})
                const object = name
                for(let key in object){
                    node.style[key] = object[key]
                }
            }
        }
    },

    class: {
        add(node, className){
            node.classList.add(className)
        },
        remove(node,className){
            node.classList.remove(className)
        },
        has(node,className){
            return node.classList.contains(className)
        }     
    },


    on(node, eventName, fn){
        node.addEventListener(eventName, fn)
    },
    off(node,eventName, fn){
        node.removeEventListener(eventName, fn)
    },
    find(selector, scope){ //scope是范围
        return (scope || document).querySelectorAll(selector)
    },
    parent(node){
        return node.parentNode
    },
    children(node){
        return node.children
    },
    siblings(node){
        return Array.from(node.parentNode.children)
        .filter(n=>n!==node)
    },
    next(node){
        let x = node.nextSibling
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x
    },
    previous(node){
        let x = node.previousSibling
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn){
        for(let i=0;i<nodeList.length;i++){
            fn.call(null,nodeList[i])
        }
    },
    index(node){  //我是第几个儿子
        const list = dom.children(node.parentNode)
        let i
        for(i=0;i<list.length;i++){
            if(list[i] === node){
                break
            }
        }
        return i
    }
};