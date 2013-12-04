<div id="place-widget-dish-category" class="place-widget-dish-category needsclick" style="display:none">
	<s class="arrow"></s>
	<div class="ddl_wrapper">
		<div class="ul_scroll">
			<ul>
				{%foreach $data.ShopDish.list as $list%}
				<li class="needsclick">
					<p id="{%$list.dishCategoryId%}" class="dish-name needsclick">{%$list.dishCategoryName%}</p>
				</li>
				{%/foreach%}
			</ul>
		</div>
	</div>
</div>
{%script%}
	require('place:widget/dishcategory/dishcategory.js').init();
{%/script%}
