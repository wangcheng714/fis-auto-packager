{%style id="/widget/photodetailtile/photodetailtile.inline.less"%}#phototile{font-family:helvetica "微软雅黑";color:#696969}#phototile .tile-title{margin:0 0 15px 10px;padding:15px 0 0}#phototile .tile-arena{font-size:0;flex-wrap:wrap;padding:0 0 0 10px}#phototile .tile-arena:after{clear:both;content:'';display:block}#phototile .tile-arena-item{margin:0 10px 10px 0;display:inline-block;border:1px solid #a3a3a3;overflow:hidden;float:left}#phototile .tile-arena img{display:block;width:100%;height:100%}#phototile .tile-footer{margin:10px 0;display:none}#phototile #photo-tile-more-imgs{display:block;margin:auto;width:50%;text-align:center;height:30px;line-height:30px;color:#444d62;background-color:#f9f9f9;border:1px solid #bec1c4;border-radius:3px;-webkit-box-sizing:border-box;box-sizing:border-box}{%/style%}<div id="phototile">
<h3 class="tile-title">商家图片<span class="tile-num">({%count($widget_data.photos)%}张)</span>
</h3>
<div class="tile-arena">
</div>
<div class="tile-footer">
<a id="photo-tile-more-imgs">查看更多图片 &gt;</a>
</div>
{%script%}
        (require('place:widget/photodetailtile/photodetailtile.js')).init({%json_encode($widget_data)%});
    {%/script%}
</div>