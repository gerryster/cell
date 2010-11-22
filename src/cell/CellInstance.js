require.def('cell/CellInstance',
   [ 'cell/util/createClass',
     'cell/config' ],
   function(createClass,config){
      var passThrough = function(data,cb){cb(data);};
   
      return createClass({
         'init': function(_cell,_instId,_cellDelegates,
                          _targetNode, _replaceNode, _data, _callback){
            var _this = this,
                _mangledName = _cell.name.replace('/','_'),
                _getRenderData = (_cellDelegates && _cellDelegates.getRenderData) || passThrough,
                _templateRenderer = (_cellDelegates && _cellDelegates.templateRenderer) || config.defaultTemplateRenderer.value,
                _container = {
                     node:null,
                     id:(typeof _instId === 'number' && _mangledName+_instId)
                           || (typeof _instId === 'string' && _instId),
                     className:_mangledName
                  };
            
            Object.defineProperties(_this,{
               'cell' : {enumerable:true, get:function(){return _cell;}},
               
               'data' : {enumerable:true, get:function(){return _data;}},
               
               'node' : {enumerable:true, get:function(){return _container.node;}}
            });
            
            _getRenderData(_data,function(newData){
               _data = newData;
               
               _templateRenderer(_cell,_container,_data,function(xhtml){
                  // Attach DOM Node
                  if(_replaceNode){
                     _targetNode.parentNode.replaceChild(_container.node,_targetNode);
                  }else{
                     _targetNode.appendChild(_container.node);
                  }
   
                  try{
                     if(typeof _callback === 'function'){
                        _callback(_this);
                     }
                  }catch(e){
                     console.log(e);
                  }
               });
            });
         }
      });
   }
);
