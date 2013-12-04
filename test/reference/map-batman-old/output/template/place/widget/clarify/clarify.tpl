{%style id="/widget/clarify/clarify.inline.less"%}/**
* @fileoverview 本城无结果css
**/
.place-widget-clarify .cl_d1 {
  min-width: 3em;
  -webkit-transform: translate(-0.357em, 0.214em);
  text-align: left;
}
.place-widget-clarify #cl_o0 li,
.place-widget-clarify #cl_o1 li {
  position: relative;
  background-color: transparent;
}
.place-widget-clarify .cl_opt {
  position: absolute;
  top: 0;
  right: 0.714em;
  vertical-align: middle;
}
.place-widget-clarify .cl_opt .gt {
  vertical-align: middle;
}
.place-widget-clarify div.result .res dt.hd.search_result {
  margin-top: 0px;
  min-height: 0;
}
.place-widget-clarify .bd .list li {
  color: #606060;
}
.place-widget-clarify .res .list {
  text-shadow: none;
}
.place-widget-clarify .bd .list li {
  display: -webkit-box;
  -webkit-box-align: center;
  padding: 0 1.2em;
  height: 3.3em;
  min-height: 3.3em;
  border: 1px solid #fff;
  border-bottom-color: #d9d9d9;
  color: #606060;
  position: relative;
  background-color: transparent;
}
.place-widget-clarify .bd .list li a {
  display: block;
  height: 100%;
  width: 100%;
  color: #606060;
  line-height: 46px;
}
.place-widget-clarify .list .gt {
  width: 10px;
  height: 10px;
  background: url(/static/place/images/linelist_714843f.png) no-repeat 0 -71px;
  background-size: 15px 81px;
  margin-right: 5px;
  vertical-align: middle;
}
.place-widget-clarify .res .s4-tip {
  background-color: #F2F2F2;
  padding: 14px 40px 11px 40px;
  border-bottom: 1px solid #e7e7e7;
}
.place-widget-clarify .bd div.cl_tip {
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  padding: 0.5em 0 1em;
}
.place-widget-clarify .res ol.s4 {
  background-color: #eeeeee;
}
.place-widget-clarify .res dd.bd,
.place-widget-clarify .res dd.mk {
  margin: 4px auto 0;
  width: 100%;
}
{%/style%}<div class="result place-widget-clarify">
    <dl class="res poi">
        <dd class="bd bd1">
            {%assign var="content" value=$data.content%}
            {%assign var="current_city" value=$data.current_city%}
            {%assign var="more_city" value=$data.more_city%}
            <ol class="s4">
                <div class='cl_tip'><img src='http://s1.map.bdimg.com/mobile/static/place/ui/images/warn_ca48f04c.png' class='rl_warn_l'>在<b>{%$current_city.name%}</b>未找到相关地点</div>
                <div class='s4-tip'>您可以选择在以下城市中搜索到的结果，或者“返回”重新输入搜索的内容</div>
            </ol>
            <ol class="list s7">
                {%foreach $content as $item%}
                    <li data-args="{%$item.code%}" data-fn="f">
                        <a href="{%$item.url%}">
                            <div class="cl_d2">
                                <b>{%$item.name%}</b>
                            </div>
                            <div class="cl_opt">
                                <em class="cl_d1"><b>{%$item.num%}</b></em>
                                <em class="gt"></em>
                            </div>
                        </a>
                    </li>
                {%/foreach%}
                {%if ($more_city)%}
                    <li><dl><dt><b>更多地区：</b></dt></dl></li>
                    {%foreach $more_city as $key => $item%}
                        <li data-args="{%$key%}" data-fn="s">
                            <a href="{%$item.url%}">
                                <div class="cl_d2">
                                    <b>{%$item.province%}</b>
                                </div>
                                <div class="cl_opt">
                                    <em class="cl_d1"><b>{%$item.num%}</b></em>
                                    <em class="gt"></em>
                                </div>
                            </a>
                        </li>
                    {%/foreach%}
                {%/if%}
            </ol>
        </dd>
    </dl>
</div>