{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
{%* place detail页布局样式 *%}
<style  type="text/css">.place-page-detail{padding:0 8px 8px;background:#F2F2F2;overflow:hidden}.place-page-detail>[class^=place-widget-],.place-page-detail>[id^=place-pagelet-]>[class^=place-widget-]{margin:10px 0}.place-page-detail .place-widget-comment,.place-page-detail .place-widget-overview,.place-page-detail .place-widget-sitelink,.place-page-detail .place-widget-tosearch,.place-page-detail .place-widget-cater,.place-page-detail .place-widget-recommend{margin:20px 0}.place-page-detail.movie>[class^=place-widget-],.place-page-detail.movie>[id^=place-pagelet-]>[class^=place-widget-]{margin-bottom:0}.place-page-detail.movie div.place-widget-goto{margin:0 0 10px}.place-page-detail.movie div.place-widget-captain,.place-page-detail.movie div.place-pagelet-basicmovieinfo,.place-page-detail.movie div.place-widget-promotion{margin:10px 0 0}</style>
{%/block%}
{%block name="main"%}
{%* 导航widget *%}
{%widget name="common:widget/nav/nav.tpl" title=$data.result.wd mapLink=$commonUrl.nav.map pageType="detail"%}
{%if ereg("searchFlag=([A-Za-z]+)", $smarty.server.REQUEST_URI, $regs)%}
{%$entry = $regs[1]%}
{%/if%}
{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
{%$wd = urldecode($regs[1])%}
{%/if%}
{%if !empty($data.content.ext.src_name)%}
{%$srcname = $data.content.ext.src_name%}
{%else%}
{%$srcname = ""%}
{%/if%}
{%if !empty($data.content.name)%}
{%$bname = $data.content.name%}
{%else%}
{%$bname = ""%}
{%/if%}
<div class="place-page-detail {%if $data.isMovieth%}movie{%/if%}">
{%widget name="place:widget/captain/captain.tpl" widget_data=$data.content ism=$data.isMovieth%}
{%block name="detailInfo"%}{%/block%}
{%if $data.isMovieth%}
{%widget name="place:widget/gotomovie/gotomovie.tpl" widget_data=$data.content.goto wd=$data.content.ext.src_name bname=$data.content.name phone=$data.content.phone%}
{%else%}
{%widget name="place:widget/goto/goto.tpl" widget_data=$data.content.goto wd=$wd srcname=$srcname entry=$entry bname=$bname%}
{%if $data.content.pano == 1%}
{%widget name="place:widget/streetview/streetview.tpl" street_url=$data.content.streetUrl%}
{%/if%}
{%widget name="place:widget/telephone/telephone.tpl" widget_data=$data.content wd=$wd srcname=$srcname bname=$bname%}
{%widget name="place:widget/commentbtn/commentbtn.tpl" widget_data=$data.content src_name=$data.result.wd%}
{%/if%}
<script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
{%block name="richInfo"%}{%/block%}
{%*电影不展现tosearch组件*%}
{%if !$data.isMovieth%}
{%widget name="place:widget/tosearch/tosearch.tpl" widget_data=$data.content%}
{%/if%}
</div>
{%script%}
        //添加place详情页展现量
        var stat = require('common:widget/stat/stat.js'),
            util = require('common:static/js/util.js'),
            wd = $('.common-widget-nav .title span').text();

        stat.addStat(STAT_CODE.PLACE_DETAIL_VIEW, {'wd': wd, 'srcname': '{%$srcname|f_escape_js%}'});

        BigPipe.asyncLoad([{
            id: 'place-pagelet-basicinfo'
        },{
            id: 'place-pagelet-basicmovieinfo'
        }, {
            id: 'place-pagelet-petroprice'
        }, {
            id: 'place-pagelet-movienews'
        }, {
            id: 'place-pagelet-bookphone'
        }, {
            id: 'place-pagelet-promotion'
        }, {
            id: 'place-pagelet-promotionm'
        },{
            id: 'place-pagelet-toplist'
        }, {
            id: 'place-pagelet-impression'
        }, {
            id: 'place-pagelet-overview'
        }, {
            id: 'place-pagelet-comment'
        }, {
            id: 'place-pagelet-recommend'
        }, {
            id: 'place-pagelet-sitelink'
        }, {
            id: 'place-pagelet-scopebook'
        }], util.jsonToUrl({uid: '{%$data.content.uid|f_escape_js%}', pageletGroup: 'ext'}));
    {%/script%}
{%require name='place:page/detail/base.tpl'%}{%/block%}