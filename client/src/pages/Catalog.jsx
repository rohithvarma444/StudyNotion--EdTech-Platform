import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import CourseCard from '../components/core/Catalog/CourseCard';
import Footer from '../components/common/Footer';

function Catalog() {
    const [loading, setLoading] = useState(false);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const { catalogName } = useParams();

    // Fetch categories to get the categoryId
    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const res = await apiConnector('GET', categories.CATEGORIES_API);
                console.log(res)
                if (res?.data?.success) {
                    const category = res?.data?.data?.find((ct) =>
                        ct.name.split(' ').join('-').toLowerCase() === catalogName
                    );
                    if (category) {
                        setCategoryId(category._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, [catalogName]);

    // Fetch catalog page data after categoryId is set
    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true);
            try {
                const res = await getCatalogPageData(categoryId);
                console.log('----->', res);
                setCatalogPageData(res);
            } catch (error) {
                console.error('Error fetching category details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);


    return (
        <div className="text-white">
            {/* Breadcrumb */}
            <div>
                <p>
                    {"Home / Catalog / "}
                    <span className="text-yellow-5">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p>{catalogPageData?.data?.selectedCategory?.name}</p>
                <p>{catalogPageData?.data?.selectedCategory?.description}</p>
            </div>

            {/* Courses to get you started */}
            <div className="text-white">
                <h1>Courses to get you started</h1>
                <div className="flex gap-x-3">
                    <p>Most Popular</p>
                    <p>New</p>
                </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                </div>
            </div>

            {/* Top Courses in Category */}
            <div>
                <h1>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</h1>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                </div>
            </div>

            {/* Frequently Bought */}
            <div>
                <h1>Frequently Bought</h1>
                <div className="py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, index) => (
                            <CourseCard course={course} key={index} Height={"h-[400px]"} />
                        ))}
                    </div>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            
            <Footer />
        </div>
    );
}

export default Catalog;
