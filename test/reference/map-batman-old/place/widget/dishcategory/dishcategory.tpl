<div id="place-widget-dish-category" class="place-widget-dish-category" style="display:none">
	<s class="arrow"></s>
	<div class="ddl_wrapper">
		<div class="ul_scroll">
			<ul>
				{%foreach $data.ShopDish.list as $list%}
				<li>
					<p id="{%$list.dishCategoryId%}" class="dish-name">{%$list.dishCategoryName%}</p>
				</li>
				{%/foreach%}
			</ul>
		</div>
	</div>
</div>
{%script%}
require('dishcategory.js');
{%/script%}