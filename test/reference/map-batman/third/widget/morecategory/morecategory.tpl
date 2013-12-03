<!--@fileOverview 更多分类页 -->
<div class="index-widget-morecategory">
	<div id="more-category" class="rl_wrapper rl_tree">
	<ul class="rl_list">
		{%foreach $data.category as $index=>$item%}
		    <li li_type="top" name="{%$item.parentname%}" class="category categoryparent">
		        <h4>{%$item.parentname%}</h4>
		        <span class="rl_opt"><em class="rl_opt_btn rl_opt_close"></em></span>
	    	</li>
	    	<li class="rl_sub_list" style="display:none;">
	    		<ul class="rl_sub_wrapper">
			    	{%foreach $item.childlist as $childindex=>$childitem%}
			    	<li li_type="top" name="{%$childitem%}" class="category categorychild">
			             <h4>
			             	{%$childitem.name%}
			             </h4>
			            <span class="rl_opt">
			            	<em class="rl_opt_btn rl_opt_close"></em>
			            </span>
			        </li>
			    	{%/foreach%}
	    		</ul>
	    	</li>
		{%/foreach%}
	</ul>
	</div>
</div>
{%script%}
    (require("morecategory.js")).init();
{%/script%}