<div class="pagebody place-widget-seacrhnave">
    <div id="se_box" class="se-box">
        <div id="se_wrap" class="se-wrap">
            <div id="se_dir">
                <table>
                    <tr>
                        <td>
                            <div id="se_dir_reverse" class="se-btn">
                                <div class="route-pic se-rev-icon"></div>
                            </div>
                        </td>
                        <td width="100%">
                            <div class="se-inner" style="margin-bottom: 6px;">
                                <em class="ipt-icon start">起</em>
                                <form id="se_start_form" class="se-dir-form">
                                    <input type="text" key="start" id="se_txt_start" class="se_txt_start" style="position: absolute; top: 0px; left: 0px; width: auto; right: 40px;">
                                </form>
                            </div>
                            <div class="se-inner">
                                <em class="ipt-icon end">终</em>
                                <form id="se_end_form" class="se-dir-form">
                                    <input type="text" key="end" id="se_txt_end" class="se_txt_end"/>
                                </form>
                            </div>
                        </td>
                    </tr>
                </table>              
            </div>
            <div class='tactics' style="text-align:center;"> 
                 <span class="se-bus-btn se-btn-tr" data-value="1"><em class="route-pic se-bus-icon"></em>公交</span>
                 <span class="se-drive-btn se-btn-tr" data-value="2"><em class="route-pic se-drive-icon"></em>驾车</span> 
                 <span class="se-walk-btn se-btn-tr" data-value="3"><em class="route-pic se-walk-icon"></em>步行</span>
          </div> 
        </div>
    </div>
</div>
{%script%}
    (require("seacrhnave.js")).init();
{%/script%}